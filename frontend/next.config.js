module.exports = {
  output: "export",
  images: {
    unoptimized: true, // Required if using Next.js images in static export
  },
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3000/dev",
  },
};
