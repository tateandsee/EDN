export default function ModelsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AI Models</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Browse our collection of AI models
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Sample Model</h2>
          <p className="text-muted-foreground">This is a sample model card</p>
        </div>
      </div>
    </div>
  )
}
