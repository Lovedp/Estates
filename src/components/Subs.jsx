import { Send, MousePointer } from "lucide-react";

export default function NewsletterSection() {
  return (
    <div className="w-full bg-gray-100 py-16">
      <div className="max-w-3xl mx-auto text-center px-6">
        {/* Pointer Icon */}
        <div className="flex justify-center mb-4">
          <MousePointer className="w-10 h-10 text-purple-600" />
        </div>

        {/* Header */}
        <h2 className="text-4xl font-bold text-gray-900">Stay Up to Date</h2>
        <p className="text-lg text-gray-700 mt-2">Subscribe to our newsletter</p>

        {/* Subscription Box */}
        <div className="mt-6 relative max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center">
            Send <Send className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
