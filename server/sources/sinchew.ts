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

export default defineSource(async ({ paginate }) => {
  const baseUrl = "https://www.sinchew.com.my/ajx-api/category_posts/?cat=447&nooffset=true&editorialcat=0&posts_per_pages=10"

  return paginate(
    // 获取3页数据
    Array.from({ length: 3 }, (_, i) => ({
      url: `${baseUrl}&page=${i + 1}`,
    })),
    async ({ url }) => {
      const articles: Article[] = await myFetch(url)
      return articles.map((article) => ({
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
    }
  )
})
