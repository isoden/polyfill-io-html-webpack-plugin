export function main() {
  Array.from([])

  new IntersectionObserver(() => {})

  import('./add').then(({ add }) => add(1, 2))
}
