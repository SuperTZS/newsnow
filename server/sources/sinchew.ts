import type { NewsItem } from "@shared/types"

interface SinChewAPIResponse {
  data: {
    ID: number
    title: string          // 实际字段名（不是post_title）
    permalink: string      // 完整新闻链接（无需拼接）
    image: string          // 实际图片字段（不是image_url）
    time_display: string   // 相对时间如"6天前"（备用）
    cat?: string           // 分类名称（可选）
  }[]
}

export default defineSource(async () => {
  const baseURL = "https://www.sinchew.com.my"
  const news: NewsItem[] = []
  
  // 抓取3页数据（每页10条）
  for (let page = 1; page <= 3; page++) {
    const apiUrl = `${baseURL}/ajx-api/category_posts/?cat=447&page=${page}&nooffset=true&editorialcat=0&posts_per_pages=10`
    
    const response: SinChewAPIResponse = await myFetch(apiUrl, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Referer": `${baseURL}/category/全国/封面头条`
      }
    })

    response.data.forEach(item => {
      news.push({
        title: item.title,  // 使用实际title字段
        url: item.permalink, // 直接使用API提供的完整URL
        extra: {
          time: item.time_display, // 精确时间戳
          // 使用相对时间（如需）：time: item.time_display
          image: item.image ? proxyPicture(item.image) : undefined // 使用实际image字段
        }
      })
    })

    // 每页请求间隔1秒（避免反爬）
    if (page < 3) await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return news
})
