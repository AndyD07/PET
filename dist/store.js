/* Product content is demonstration data. Prices are stored in cents. */
globalThis.PetStore = (() => {
  const products = [
    { id: 'chicken', name: '原切鸡胸冻干', english: 'CHICKEN BITES', category: 'both', pet: '猫狗通用', weight: '60g', price: 2900, sales: '1,200+', ingredient: '演示配方：鸡胸肉', tag: '人气之选', color: 'cream', image: 0 },
    { id: 'salmon', name: '三文鱼冻干粒', english: 'SALMON CUBES', category: 'cat', pet: '猫咪零食', weight: '50g', price: 3900, sales: '860+', ingredient: '演示配方：三文鱼', tag: '猫咪偏爱', color: 'pink', image: 1 },
    { id: 'duck', name: '慢烘鸭胸肉条', english: 'DUCK JERKY', category: 'dog', pet: '狗狗零食', weight: '80g', price: 3200, sales: '920+', ingredient: '演示配方：鸭胸肉', tag: '散步小奖励', color: 'green', image: 2 },
    { id: 'fish', name: '酥脆小鱼干', english: 'LITTLE FISH', category: 'cat', pet: '猫咪零食', weight: '40g', price: 2500, sales: '680+', ingredient: '演示配方：小鱼', tag: '小口满足', color: 'green', image: 3 },
    { id: 'beef', name: '原香牛肉条', english: 'BEEF STRIPS', category: 'dog', pet: '狗狗零食', weight: '70g', price: 4500, sales: '750+', ingredient: '演示配方：牛肉', tag: '肉香时刻', color: 'cream', image: 4 },
    { id: 'pumpkin', name: '南瓜鸡肉小方', english: 'PUMPKIN & CHICKEN', category: 'both', pet: '猫狗通用', weight: '80g', price: 2800, sales: '560+', ingredient: '演示配方：鸡胸肉、南瓜', tag: '尝点新口味', color: 'pink', image: 5 }
  ];
  const byId = Object.fromEntries(products.map(p => [p.id, p]));
  function restore(raw) {
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      return Object.fromEntries(Object.entries(parsed).filter(([id,n]) => Object.hasOwn(byId,id) && Number.isInteger(n) && n > 0).map(([id,n]) => [id, Math.min(n,99)]));
    } catch { return {}; }
  }
  function change(cart, id, delta) {
    const next = {...cart};
    if (!Object.hasOwn(byId,id)) return next;
    const quantity = Math.max(0, Math.min(99, (next[id] || 0) + delta));
    if (quantity) next[id] = quantity; else delete next[id];
    return next;
  }
  const count = cart => Object.values(cart).reduce((sum,n) => sum+n,0);
  const total = cart => Object.entries(cart).reduce((sum,[id,n]) => sum + (byId[id]?.price || 0) * n,0);
  return {products, byId, restore, change, count, total};
})();
