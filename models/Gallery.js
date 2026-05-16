module.exports = (sequelize, DataTypes) => {
    const Gallery = sequelize.define('Gallery', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gallery_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      page: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: true
    });

    Gallery.associate = (models) => {
      Gallery.hasMany(models.GalleryImage, {
        foreignKey: 'galleryId',
        as: 'images'
      });
    };
  
    return Gallery;
  };