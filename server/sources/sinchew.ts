interface SinChewPost {
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
  // 获取3页数据
  const pages = [1, 2, 3]
  const allPosts: SinChewPost[] = []
  
  // 并发请求所有页面
  await Promise.all(pages.map(async (page) => {
    const url = `https://www.sinchew.com.my/ajx-api/category_posts/?cat=447&page=${page}&nooffset=true&editorialcat=0&posts_per_pages=10`
    const response = await myFetch(url)
    const posts: SinChewPost[] = await response.json()
    allPosts.push(...posts)
  }))

  // 转换数据格式
  return allPosts.map((post) => {
    return {
      id: post.ID.toString(),
      title: post.title,
      url: post.permalink,
      extra: {
        mobileUrl: post.permalink,
        summary: post.excerpt.trim(),
        time: post.time_display,
        image: post.image && proxyPicture(post.image, "encodeBase64URL"),
        category: post.cat,
        categoryLink: post.catlink,
      }
    }
  })
})
