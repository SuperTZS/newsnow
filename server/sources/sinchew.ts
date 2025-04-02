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

interface hotPost1 {
  zero:SinChewPost[];
}

interface hotPost2 {
  result:SinChewPost[];
}

const latest_posts = defineSource(async () => {
  const allPosts: SinChewPost[] = []
  
  // 使用 for 循环获取 3 页数据
  for (let page = 1; page <= 3; page++) {
    const url = `https://www.sinchew.com.my/ajx-api/latest_posts/?page=${page}`
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
    pubDate: parseRelativeDate(post.time_display, "Asia/Kuala_Lumpur").valueOf(),
    image: post.image && proxyPicture(post.image, "encodeBase64URL"),
    extra: {
      category: post.cat,
      categoryLink: post.catlink,
    }
  }))
})

//hot

const hot_posts = defineSource(async () => {

  const allPosts:SinChewPost[] = []

  // 使用 for 循环获取 3 页数据
  for (let page = 1; page <= 3; page++) {
    let url = ``
    let posts:SinChewPost[] =[]
    if (page==1) {

      url = 'https://www.sinchew.com.my/hot-post-list/?taxid=-1'
      const response:hotPost1 = JSON.parse(await myFetch(url))
      
      posts = response.zero
    }
    else {
      url = `https://www.sinchew.com.my/hot-post-list/?taxid=-1&page=${page}&range=6H`
      const response:hotPost2 = JSON.parse(await myFetch(url))
      
      posts = response.result
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

export default defineSource({
  "sinchew": hot_posts,
  "sinchew-hot": hot_posts,
  "sinchew-realtime": latest_posts
})
