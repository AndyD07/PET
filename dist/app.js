(() => {
  'use strict';
  const {products,byId,restore,change,count,total} = PetStore;
  const $ = selector => document.querySelector(selector);
  const storageKey = 'tails-treats-cart-v1';
  let cart = {};
  let storageAvailable = true;
  let toastTimer;
  try { cart = restore(localStorage.getItem(storageKey)); } catch { storageAvailable = false; }
  const money = cents => `¥${(cents/100).toFixed(2)}`;
  function image(p, extra = '') {
    return `<div class="product-image image-shell ${extra}" style="--col:${p.image%3};--row:${Math.floor(p.image/3)}"><img src="assets/treats.png" alt="${p.name}零食示意图" loading="lazy"><span class="image-fallback">${p.name}</span></div>`;
  }
  function connectFallbacks(root) {
    root.querySelectorAll('.image-shell img').forEach(img => {
      const fail = () => img.parentElement.classList.add('failed');
      img.addEventListener('error',fail,{once:true});
      if (img.complete && !img.naturalWidth) fail();
    });
  }
  function renderProducts(filter = 'all') {
    const visible = products.filter(p => filter === 'all' || p.category === filter || p.category === 'both');
    $('#product-grid').innerHTML = visible.map(p => `<article class="product-card" data-product="${p.id}">
      ${image(p).replace('</div>',`<span class="product-tag">${p.tag}</span><span class="product-number">NO. 0${p.image+1}</span></div>`)}
      <div class="product-content"><div class="product-meta"><span class="english">${p.english}</span><span>${p.pet}</span></div><h3>${p.name}</h3><p class="ingredient">${p.ingredient}</p><div class="product-bottom"><div class="price"><span class="currency">¥</span>${p.price/100}<small>/ ${p.weight}</small><span class="sales">演示销量 ${p.sales}</span></div><button class="add-button" data-add="${p.id}" aria-label="将${p.name}加入购物车">+</button></div></div></article>`).join('');
    $('#result-count').textContent = `共 ${visible.length} 款小奖励`;
    connectFallbacks($('#product-grid'));
  }
  function announce(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'),2500);
  }
  function persist() {
    try { localStorage.setItem(storageKey,JSON.stringify(cart)); storageAvailable=true; } catch { storageAvailable=false; }
  }
  function updateSummary() {
    $('#cart-count').textContent = count(cart);
    $('#drawer-count').textContent = count(cart);
    $('#open-cart').setAttribute('aria-label',`打开购物车，共 ${count(cart)} 件商品`);
    $('#cart-total').textContent = money(total(cart));
    $('#storage-note').textContent = storageAvailable ? '零食袋仅保存在当前浏览器中' : '浏览器存储不可用，刷新后零食袋将清空';
  }
  function renderCart(focusTarget) {
    updateSummary();
    const entries = Object.entries(cart);
    $('#cart-items').innerHTML = entries.length ? entries.map(([id,n]) => {
      const p=byId[id];
      return `<article class="cart-item">${image(p)}<div class="cart-item-info"><h3>${p.name}</h3><p>${p.pet} · ${p.weight}</p><span class="cart-item-price">${money(p.price*n)}</span><div class="quantity-row"><div class="quantity-controls"><button data-change="${id}" data-delta="-1" aria-label="减少${p.name}数量">−</button><span aria-label="数量">${n}</span><button data-change="${id}" data-delta="1" aria-label="增加${p.name}数量" ${n>=99?'disabled':''}>+</button></div><button class="remove-item" data-remove="${id}" aria-label="移除${p.name}">移除</button></div></div></article>`;
    }).join('') : `<div class="empty-cart"><svg class="paw"><use href="#i-paw"/></svg><h3>小尾巴还在期待</h3><p>零食袋空空的，去选一份小幸福吧。</p><button class="primary-button" id="empty-shop">去挑选零食 →</button></div>`;
    connectFallbacks($('#cart-items'));
    if(focusTarget) {
      const target=$('#cart-items').querySelector(focusTarget);
      if(target && !target.disabled) target.focus();
      else ($('#cart-items button') || $('#cart-dialog [data-close]')).focus();
    }
  }
  function openDialog(dialog) { dialog.showModal(); document.body.classList.add('modal-open'); }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close',() => document.body.classList.remove('modal-open'));
    dialog.addEventListener('click',event => {
      if(event.target.closest('[data-close]')) dialog.close();
      if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}
    });
  });
  $('.filters').addEventListener('click',event => {
    const button=event.target.closest('[data-filter]');
    if(!button)return;
    document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    renderProducts(button.dataset.filter);
  });
  $('#product-grid').addEventListener('click',event => {
    const button=event.target.closest('[data-add]');
    if(!button)return;
    const id=button.dataset.add;
    if(cart[id]>=99){announce('这款零食最多可添加 99 件');return;}
    cart=change(cart,id,1);persist();updateSummary();announce(`已将${byId[id].name}放进零食袋`);
  });
  $('#open-cart').addEventListener('click',() => {renderCart();openDialog($('#cart-dialog'));});
  $('#cart-items').addEventListener('click',event => {
    const button=event.target.closest('button');
    if(!button)return;
    if(button.id==='empty-shop'){$('#cart-dialog').close();$('#products').scrollIntoView({behavior:'smooth'});return;}
    if(button.dataset.change){const id=button.dataset.change;cart=change(cart,id,Number(button.dataset.delta));persist();renderCart(`[data-change="${id}"][data-delta="${button.dataset.delta}"]`);}
    if(button.dataset.remove){delete cart[button.dataset.remove];persist();renderCart('[data-change]');}
  });
  const policies = {
    shipping:{title:'配送说明',content:'这是一个宠物零食前端演示商店，目前不接收真实订单，也不会安排发货。正式上线前，品牌方需要补充配送范围、运费规则、发货时效及物流查询方式。'},
    returns:{title:'售后政策',content:'当前商品与价格均为演示内容，不发生真实交易。正式上线前，品牌方需要明确退换货条件、申请方式、处理时效，以及食品类商品的售后规则。客服联系方式将在确认后提供。'}
  };
  document.querySelectorAll('[data-policy]').forEach(button => button.addEventListener('click',() => {const policy=policies[button.dataset.policy];$('#policy-title').textContent=policy.title;$('#policy-content').textContent=policy.content;openDialog($('#policy-dialog'));}));
  window.addEventListener('storage',event => {if(event.key===storageKey || event.key===null){cart=restore(event.newValue);updateSummary();if($('#cart-dialog').open)renderCart();}});
  connectFallbacks(document);
  renderProducts();updateSummary();
})();
