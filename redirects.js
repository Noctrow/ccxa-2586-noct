// Variable existente con algunos enlaces
var redirects = {
  "FB": "https://www.facebook.com/chochoxapp"
};

// Función para generar un hash permanente basado en una URL
function generateShortCode(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash = hash & hash; // Convierte a entero de 32 bits
  }
  return Math.abs(hash).toString(36); // Convierte a base 36 (caracteres más cortos)
}

// Función para cargar el sitemap y extraer las URLs (asíncrona)
async function loadSitemapAndGenerateRedirects() {
  try {
    const response = await fetch("https://blog.chochoxapp.com/sitemap.xml");
    if (!response.ok) throw new Error("Error al cargar el sitemap");

    const sitemapText = await response.text();

    // Parsear el XML para extraer las URLs
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sitemapText, "application/xml");
    const urlElements = xmlDoc.getElementsByTagName("loc");

    // Iterar sobre las URLs y generar códigos cortos
    for (const urlElement of urlElements) {
      const url = urlElement.textContent.split("?")[0]; // Eliminar parámetros después de "?"
      if (url && url.startsWith("http")) { // Validar que es una URL válida
        const shortCode = generateShortCode(url);

        // Si el código corto no existe en redirects, agregarlo
        if (!redirects[shortCode]) {
          redirects[shortCode] = url;
        }
      }
    }

    console.log("Redirecciones generadas:", redirects);
  } catch (error) {
    console.error("Error cargando el sitemap:", error);
  }
}

// Llamar a la función para cargar y procesar el sitemap
loadSitemapAndGenerateRedirects();
