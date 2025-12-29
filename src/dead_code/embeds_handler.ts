// import { makeAppreciateEmbed } from "./appreciate-embed";
// import { makeHelpFeedbackEmbed } from "./help-feedback-embed";

// const aceIconURL =
//   "https://static.wixstatic.com/media/c564dd_738bdb48aa28415e985be672213f298c~mv2.png/v1/fill/w_254,h_402,al_c,q_85,usm_0.66_1.00_0.01/c564dd_738bdb48aa28415e985be672213f298c~mv2.webp";

// export interface EcaEmbedOptions {
//   color?: string,
//   title?: string,
//   url?: string,
//   author?: {
//     name: string,
//     iconURL: string,
//     url: string,
//   },
//   description?: string,
//   thumbnail?: string,
//   fields?: string,
//   image?: string,
//   footer?: {
//     text: string,
//   },
// }

// export function embedHandler(type: string, options: EcaEmbedOptions) {
//   let cleanedOptions;
//   const color = options.color || "#00db80";
//   const title = options.title || ""; // length 0 arguments should not be constructed in embed
//   const url = options.url || "";
//   const author = options.author || {
//     name: "ECA",
//     iconURL: aceIconURL,
//     url: "https://www.uwacc.com/ace",
//   };
//   const description = options.description || "";
//   const thumbnail = options.thumbnail || "";
//   const fields = options.fields || "";
//   const image = options.image || "";
//   const footer = options.footer || {
//     text: "For help using ECA, type /help or contact #Leben3185",
//   };

//   cleanedOptions = {
//     color,
//     title,
//     url,
//     author,
//     description,
//     thumbnail,
//     fields,
//     image,
//     footer,
//   };

//   cleanedOptions = { ...options, ...cleanedOptions };

//   switch (type) {
//     case "appreciate":
//       return makeAppreciateEmbed(cleanedOptions);
//     case "help-feedback":
//       return makeHelpFeedbackEmbed();
//     default:
//       throw new Error(`No embed found for type: ${type}`);
//   }
// }
