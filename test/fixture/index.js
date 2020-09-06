export function main() {
  Array.from([])

  new IntersectionObserver(() => {})

  // split chunk
  import('./add').then(({ add }) => add(1, 2))
}
