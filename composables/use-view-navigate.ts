import { Ref } from "nuxt/dist/app/compat/capi"

export const useViewNavigate = () => {

  let links = {} as HTMLCollectionOf<HTMLAnchorElement> | undefined

  const navigate = (event: Event) => {
    const hrefs = (event.target as Element).getAttribute('href')
    if (!hrefs) {
      return
    }

    event.preventDefault()

    window.alert(`link to: [${hrefs}]`)
  }

  const addNavigateListener = (viewer: Ref<HTMLElement | null>) => {
    links = viewer.value?.getElementsByTagName('a')
    if (!links) {
      return
    }
    Array.from(links).forEach((element) => {
      element.addEventListener('click', navigate)
    })
  }

  const removeNavigateListener = () => {
    if (!links) {
      return
    }
    Array.from(links).forEach((element) => {
      element.removeEventListener('click', navigate)
    })
  }

  return {
    addNavigateListener,
    removeNavigateListener
  }
}
