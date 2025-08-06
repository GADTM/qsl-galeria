
const axios = require("axios");

exports.handler = async function (event, context) {
  const { callSign } = event.queryStringParameters;

  if (!callSign) {
    return { statusCode: 400, body: "Falta el indicativo" };
  }

  const folder = `qsl/${callSign}`;
  const cloudName = "dgv9hbtxd";
  const apiKey = process.env."148792123799721"; //"apiKey"
  const apiSecret = process.env."jYf3wFaZjAhp1UUWGIidSb27ByE"; //"apiSecret"
  // const apiKey = "148792123799721"; //"apiKey"
  //const apiSecret = "jYf3wFaZjAhp1UUWGIidSb27ByE"; //"apiSecret"

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;

  try {
    const res = await axios.get(url, {
      auth: { username: apiKey, password: apiSecret },
      params: {
        prefix: folder,
        max_results: 100
      }
    });

    const images = res.data.resources.map(img => ({
      url: img.secure_url,
      public_id: img.public_id,
      format: img.format
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(images)
    };

  } catch (error) {
    console.error("Error desde Cloudinary:", error.message);
    return {
      statusCode: 500,
      body: "Error al consultar imágenes"
    };
  }
};
