module.exports = {
  output: "export",
  exportPathMap: async () => {
    const pathMap = {
      '/': { page: '/' },
      '/login': { page: '/login' },
      '/dashboard': { page: '/dashboard' },
    };
    return pathMap;
  },
  trailingSlash: true, // Add this line to ensure paths have trailing slashes
};
