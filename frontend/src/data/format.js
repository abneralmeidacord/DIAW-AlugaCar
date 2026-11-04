export const money = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value || 0
  );
export const dateLabel = (value) =>
  value ? new Date(value.slice(0, 10) + 'T12:00:00').toLocaleDateString('pt-BR') : '—';
export const addDays = (count) => {
  const d = new Date();
  d.setDate(d.getDate() + count);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const daysBetween = (start, end) =>
  Math.max(
    1,
    Math.round((new Date(end + 'T12:00:00') - new Date(start + 'T12:00:00')) / 86400000)
  );
export const incomeOf = (user) =>
  (user?.jobs || []).reduce((sum, job) => sum + Number(job.income || 0), 0);

export function initials(name = 'Você') {
  return (name || 'Você')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}
export function userName(user) {
  return user?.role === 'cliente' ? user.name.split(' ')[0] : user?.name;
}
