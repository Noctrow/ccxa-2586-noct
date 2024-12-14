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

// Función para cargar el sitemap y extraer las URLs
function loadSitemapAndGenerateRedirects() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://blog.chochoxapp.com/sitemap.xml", false); // false hace que la petición sea sincrónica
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const sitemapText = xhr.responseText;

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

      // Mostrar los resultados al final de la operación
      console.log("Redirecciones generadas:");
      console.log(redirects);
    }
  };
  xhr.send(); // Enviar la solicitud de forma síncrona
}

// Llamar a la función para cargar y procesar el sitemap
loadSitemapAndGenerateRedirects();