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
  const allPosts: SinChewPost[] = []
  
  // 使用 for 循环获取 3 页数据
  for (let page = 1; page <= 3; page++) {
    const url = `https://www.sinchew.com.my/ajx-api/category_posts/?cat=447&page=${page}&nooffset=true&editorialcat=0&posts_per_pages=10`
    const response = await myFetch(url)
    
    // 解析 JSON 数据
    let posts: SinChewPost[]
    if (typeof response === 'string') {
      posts = JSON.parse(response)
    } else if (response && typeof response.json === 'function') {
      posts = await response.json()
    } else {
      posts = response // 如果已经是解析好的数据
    }
    
    allPosts.push(...posts)
  }

  // 转换数据格式
  return allPosts.map((post) => ({
    id: post.ID.toString(),
    title: post.title,
    url: post.permalink,
    mobileUrl: post.permalink,
    summary: post.excerpt.trim(),
    time: post.time_display,
    image: post.image && proxyPicture(post.image, "encodeBase64URL"),
    extra: {
      category: post.cat,
      categoryLink: post.catlink,
    }
  }))
})
