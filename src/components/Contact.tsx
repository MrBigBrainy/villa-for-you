export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32 bg-zinc-900 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Contact Info */}
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-serif mb-8">
              Begin Your Journey
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed mb-12 text-lg">
              Ready to experience the extraordinary? Contact us to schedule a viewing or request more information about Villa Pik.
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm uppercase tracking-widest text-zinc-500 mb-2">Address</h4>
                <p className="text-xl font-serif">123 Luxury Lane, Paradise City, PC 54321</p>
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest text-zinc-500 mb-2">Phone</h4>
                <p className="text-xl font-serif">+1 (555) 123-4567</p>
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest text-zinc-500 mb-2">Email</h4>
                <p className="text-xl font-serif">inquire@villapik.com</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Your Message"
                  className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-10 py-4 bg-white text-zinc-900 text-sm font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors mt-4"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
