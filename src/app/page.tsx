export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <nav className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 p-4 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Coverly</div>
          <div className="space-x-4">
            <a href="#" className="hover:underline">
              Home
            </a>
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              Services
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </nav>
      <div className="flex-grow flex flex-col items-center justify-center p-24 bg-white bg-opacity-80 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Coverly</h1>
        <p className="text-gray-700">
          Coverly is a user-friendly web application designed to streamline the
          process of generating professional cover letters through user-provided
          prompts. This project aims to offer a seamless and efficient
          experience, enabling users to create personalized and impactful cover
          letters with minimal effort.
        </p>
      </div>
      <footer className="w-full bg-gray-800 text-white p-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold mb-2">Contact Us</h2>
            <p>1234 Main St, Suite 500</p>
            <p>City, State, ZIP</p>
            <p>
              Email:{" "}
              <a href="mailto:info@yourcompany.com" className="underline">
                info@yourcompany.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+1234567890" className="underline">
                (123) 456-7890
              </a>
            </p>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold mb-2">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-400 hover:text-blue-600">
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600">
                <i className="fab fa-twitter"></i> Twitter
              </a>
              <a href="#" className="text-blue-400 hover:text-pink-600">
                <i className="fab fa-instagram"></i> Instagram
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600">
                <i className="fab fa-linkedin-in"></i> LinkedIn
              </a>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-6 border-t border-gray-700 pt-4">
          <p>© 2024 Untitled Company. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
