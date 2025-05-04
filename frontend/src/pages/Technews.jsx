import { useEffect, useState } from "react"
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ExternalLink, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const TechNews = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=a87ba73e50e94637b8a5ada4b230a198`
        )
        const data = await response.json()
        setNews(data.articles)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching news:", error)
        setError("Failed to load news. Please try again later.")
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Latest Tech News</h1>
        <div className="h-1 w-20 bg-primary rounded-full mb-6"></div>
        <p className="text-muted-foreground text-center max-w-2xl">
          Stay updated with the latest technology trends, innovations, and industry insights.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden border border-border/40">
              <div className="p-4">
                <Skeleton className="h-48 w-full rounded-md mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-28" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-xl font-medium mb-2">Unable to Load News</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <Card
              key={index}
              className="overflow-hidden border border-border/40 transition-all duration-300 hover:shadow-lg hover:border-border"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                {article.urlToImage ? (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                      e.target.classList.remove("hover:scale-105")
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No image available</span>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <Badge variant="outline" className="mb-3 text-xs font-medium">
                  {article.source.name}
                </Badge>
                <CardTitle className="text-xl line-clamp-2 mb-2 leading-tight">{article.title}</CardTitle>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {article.description || "No description available."}
                </p>
              </CardContent>
              <CardFooter className="px-5 pb-5 pt-0 flex justify-between items-center">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(article.publishedAt)}
                </div>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="sm" className="gap-2">
                    Visit Source <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default TechNews
