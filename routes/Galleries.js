const express = require("express");
const router = express.Router();
const { Gallery, GalleryImage } = require("../models");

const multer = require("multer");

// 🔹 UPLOAD CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* =========================
   GET ALL GALLERIES
========================= */
router.get("/", async (req, res) => {
  try {
    const galleries = await Gallery.findAll({
      include: [{ model: GalleryImage, as: "images" }],
      order: [["createdAt", "DESC"]],
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:3001";

    const formatted = galleries.map((gallery) => {
      const g = gallery.toJSON();

      return {
        ...g,
        images: (g.images || []).map((img) => ({
          ...img,
          image_url: img.image_url.startsWith("http")
            ? img.image_url
            : `${baseUrl}/uploads/${img.image_url}`,
        })),
      };
    });

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE GALLERY
========================= */
router.post("/", async (req, res) => {
  try {
    const { title, page, gallery_type } = req.body;

    const gallery = await Gallery.create({
      title,
      page,
      gallery_type,
    });

    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPDATE GALLERY
========================= */
router.put("/:id", async (req, res) => {
  try {
    const { title, gallery_type } = req.body;

    const gallery = await Gallery.findByPk(req.params.id);
    if (!gallery) return res.status(404).json({ error: "Galeria não encontrada" });

    await gallery.update({ title, gallery_type });

    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE GALLERY
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id);
    if (!gallery) return res.status(404).json({ error: "Galeria não encontrada" });

    // apagar imagens associadas
    await GalleryImage.destroy({ where: { galleryId: gallery.id } });

    await gallery.destroy();

    res.json({ message: "Galeria eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ADD IMAGES TO GALLERY
========================= */
router.post(
  "/:id/images",
  upload.array("images", 10),
  async (req, res) => {
    try {
      const gallery = await Gallery.findByPk(req.params.id);
      if (!gallery) return res.status(404).json({ error: "Galeria não encontrada" });

      const images = req.files.map((file) => ({
        image_url: `${process.env.BASE_URL}/uploads/${file.filename}`,
        galleryId: gallery.id,
      }));

      await GalleryImage.bulkCreate(images);

      res.json({ message: "Imagens adicionadas" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =========================
   DELETE SINGLE IMAGE
========================= */
router.delete("/images/:id", async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) return res.status(404).json({ error: "Imagem não encontrada" });

    await image.destroy();

    res.json({ message: "Imagem removida" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;