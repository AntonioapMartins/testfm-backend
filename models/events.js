module.exports = (sequelize, DataTypes) => {

    const Event = sequelize.define('Event', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      event_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      media_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      media_type: {
        type: DataTypes.ENUM('image', 'video'),
        allowNull: true
      },
      document_url: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      timestamps: true
    });
  
    return Event;
  };