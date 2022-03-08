const Sequelize = require("sequelize");

const sql = new Sequelize("banco", "postgres", "", {
  host: "localhost",
  dialect: "postgres",
});

// acá definimos las tablas de nuestra base de datos
const Transaction = sql.define("Transaction", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  monto: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  descripcion: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Account = sql.define("Account", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  saldo: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
});

// Ahora vamos a relacionar 2 modelos
Account.hasMany(Transaction);
Transaction.belongsTo(Account);

module.exports = { sql, Transaction, Account };
