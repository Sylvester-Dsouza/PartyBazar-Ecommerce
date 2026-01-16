import Button from "@modules/common/components/button"

const PromoFooter = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-party-sky-400 to-party-sky-500">
      <div className="content-container">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Carefully Chosen,
            <br />
            Ready to Go.
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Every product is handpicked to ensure your party is nothing short of amazing. Quality guaranteed.
          </p>
          <Button href="/store" variant="secondary" size="lg">
            Start Shopping
          </Button>
        </div>
      </div>
    </section>
  )
}

export default PromoFooter
