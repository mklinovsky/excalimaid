export const loadExcalifont = async () => {
  const font = new FontFace(
    "Excalifont",
    "url(/fonts/Excalifont/Excalifont-Regular-a88b72a24fb54c9f94e3b5fdaa7481c9.woff2)",
  );
  await font.load();
  document.fonts.add(font);
};
