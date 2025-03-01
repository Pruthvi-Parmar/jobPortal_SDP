import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

const TechNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null); // Track selected article

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=bc45b34a2cf345ed942834467e4c687e`
        );
        const data = await response.json();
        setNews(data.articles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Latest Tech News</h1>
      
      {loading ? (
        <p className="text-center text-gray-500">Fetching latest news...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <Card key={index} className="shadow-lg rounded-lg overflow-hidden">
              <CardHeader>
                <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold">{article.title}</CardTitle>
                <p className="text-gray-600 text-sm">{article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}</p>
                <Button
                  variant="outline"
                  className="mt-3 text-indigo-600 hover:bg-indigo-50"
                  onClick={() => setSelectedArticle(article)} // Open modal with article details
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="bg-white shadow-lg max-w-4xl mx-auto p-6 rounded-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">{selectedArticle.title}</DialogTitle>
            </DialogHeader>
            <img src={selectedArticle.urlToImage} alt={selectedArticle.title} className="w-full h-80 object-cover rounded-md mt-3" />
            
            {/* Additional Information */}
            <p className="text-gray-500 text-sm mt-2">
              <strong>Source:</strong> {selectedArticle.source.name} <br />
              <strong>Author:</strong> {selectedArticle.author || "Unknown"} <br />
              <strong>Published:</strong> {new Date(selectedArticle.publishedAt).toLocaleString()}
            </p>

            {/* Full News Article */}
            <div className="mt-4 text-gray-700 text-lg leading-relaxed max-h-80 overflow-auto p-4 border rounded-md">
              {selectedArticle.content || "Full article not available. Please visit the source for more details."}
            </div>
            
            <div className="mt-6 flex justify-between">
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
              <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Visit Source
                </Button>
              </a>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TechNews;
