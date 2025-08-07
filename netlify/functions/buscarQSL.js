const axios = require("axios");

exports.handler = async function (event) {
  const { callSign } = event.queryStringParameters;

  if (!callSign) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Falta el indicativo" })
    };
  }

  const folder = `qsl/${callSign}`;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;

  try {
    const res = await axios.get(url, {
      auth: { username: apiKey, password: apiSecret },
      params: {
        prefix: folder,
        max_results: 30,
        type: "upload" // 👈 esto es clave
      }
    });

    const images = res.data.resources.map(img => ({
      url: img.secure_url,
      public_id: img.public_id,
      format: img.format
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(images)
    };

  } catch (error) {
    console.error("❌ Error desde Cloudinary:", error.response?.data || error.message);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Error al consultar imágenes" })
    };
  }
};
