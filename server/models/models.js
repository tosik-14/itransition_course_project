const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

//Users
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'active',
    allowNull: false
  },
  salesforceId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  api_token: { 
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  timestamps: false
});

//Collections
const Collection = sequelize.define('Collection', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },
  image_url: {
    type: DataTypes.STRING(255)
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: false
});

//Items
const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  collection_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Collections',
      key: 'id'
    }
  }
}, {
  timestamps: false
});

//Comments
const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  collection_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Collections',
      key: 'id'
    }
  }
}, {
  timestamps: false
});

//Categories
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  timestamps: false
});

//Tags
const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  timestamps: false
});

//Item_tags
const ItemTag = sequelize.define('Item_tag', {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Items',
      key: 'id'
    }
  },
  tag_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Tags',
      key: 'id'
    }
  }
}, { 
  timestamps: false 
});

//Collection_likes
const CollectionLike = sequelize.define('Collection_like', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  collection_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Collections',
      key: 'id'
    }
  }
}, { 
  timestamps: false 
});


User.hasMany(Collection, { foreignKey: 'user_id', as: 'owner' });
User.hasMany(Comment, { foreignKey: 'user_id' });
User.belongsToMany(Collection, { through: CollectionLike, foreignKey: 'user_id', as: 'likedCollections' });

Collection.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
Collection.belongsToMany(User, { through: CollectionLike, foreignKey: 'collection_id', as: 'likedByUsers' });
Collection.hasMany(Item, { foreignKey: 'collection_id' });
Collection.hasMany(Comment, { foreignKey: 'collection_id' });
Collection.belongsTo(Category, { foreignKey: 'category_id' });

Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Collection, { foreignKey: 'collection_id' });

Item.belongsTo(Collection, { foreignKey: 'collection_id' });

Item.belongsToMany(Tag, { through: ItemTag, foreignKey: 'item_id' });
Tag.belongsToMany(Item, { through: ItemTag, foreignKey: 'tag_id' });

Category.hasMany(Collection, { foreignKey: 'category_id' });





module.exports = {
  User,
  Collection,
  Item,
  Comment,
  Category,
  Tag,
  ItemTag,
  CollectionLike
};
