export function timestamp() {
    let [d, t] = (new Date()).toISOString().split('T')
    return `${d} ${t.split('.')[0]}`;
}
