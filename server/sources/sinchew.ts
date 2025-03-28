import type { NewsItem } from "@shared/types"

interface SinChewPost {
  post_title: string
  post_name: string
  post_date: string
  image_url: string
}

export default defineSource(async () => {
  const baseURL = "https://www.sinchew.com.my"
  const news: NewsItem[] = []
  
  // 抓取3页数据（每页10条）
  for (let page = 1; page <= 3; page++) {
    const apiUrl = `${baseURL}/ajx-api/category_posts/?cat=447&page=${page}&nooffset=true&posts_per_pages=10`
    
    const response: { data: SinChewPost[] } = await myFetch(apiUrl, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Referer": `${baseURL}/category/全国/封面头条`
      }
    })

    response.data.forEach(item => {
      news.push({
        title: item.post_title,
        url: `${baseURL}/news/${item.post_date.split(' ')[0].replace(/-/g, '')}/${item.post_name}`,
        extra: {
          time: item.post_date,
          image: item.image_url ? proxyPicture(item.image_url) : undefined
        }
      })
    })

    // 每页请求间隔1秒（避免反爬）
    if (page < 3) await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return news
})
