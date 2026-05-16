module.exports = (sequelize, DataTypes) => {
  const GalleryImage = sequelize.define('GalleryImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    galleryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  GalleryImage.associate = (models) => {
    GalleryImage.belongsTo(models.Gallery, {
      foreignKey: 'galleryId'
    });
  };

  return GalleryImage;
};