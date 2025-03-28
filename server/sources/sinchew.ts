interface Article {
  ID: number
  time_display: string
  cat: string
  catlink: string
  title: string
  play_button: string
  live_icon: string
  permalink: string
  image: string
  excerpt: string
}

export default defineSource(async () => {
  const baseUrl = "https://www.sinchew.com.my/ajx-api/category_posts/?cat=447&nooffset=true&editorialcat=0&posts_per_pages=10"
  
  // 获取前三页数据
  const pagePromises = [1, 2, 3].map(page => 
    myFetch<Article[]>(`${baseUrl}&page=${page}`)
  )
  
  const pages = await Promise.all(pagePromises)
  const allArticles = pages.flat()
  
  return allArticles.map(article => ({
    id: article.ID.toString(),
    title: article.title,
    extra: {
      image: article.image && {
        url: proxyPicture(article.image),
        scale: 1.5,
      },
      category: article.cat,
      time: article.time_display,
    },
    url: article.permalink,
    mobileUrl: article.permalink,
  }))
})
