import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const baseURL = "https://www.sinchew.com.my"
  const html: any = await myFetch(baseURL)
  const $ = cheerio.load(html)
  
  const news: NewsItem[] = []
  
  // 选择所有新闻文章容器
  $(".desktop-3col-mobile-1col.type2.vertical-post-frame").each((_, el) => {
    const $el = $(el)
    
    // 从script标签提取文章ID（备用方案）
    let id = ""
    const scriptContent = $el.find("script").html() || ""
    const idMatch = scriptContent.match(/post_ids_in_listing.push\("(\d+)"\)/)
    if (idMatch && idMatch[1]) {
      id = idMatch[1]
    }
    
    // 提取主要信息
    const title = $el.find("h2.title a").text().trim()
    const url = $el.find("h2.title a").attr("href") || ""
    const image = $el.find(".img-frame img").attr("src") || ""
    const time = $el.find(".meta .time").text().trim()
    
    if (title && url) {
      news.push({
        id: id || url.split("/").pop() || "", // 优先使用文章ID，其次使用URL最后部分
        title,
        url: url.startsWith("http") ? url : `${baseURL}${url}`, // 确保绝对URL
        extra: {
          time,
          image: image ? proxyPicture(image) : undefined, // 使用项目的图片代理函数
          // 可以从data-title属性获取更多信息（如果有需要）
          // originalTitle: $el.find("h2.title a").attr("data-title") 
        }
      })
    }
  })
  
  return news
})