const { Transaction, Account, sql } = require("./models.js");

async function syncBD() {
  await sql.sync({ force: true });
}

async function nuevaTransaccion(cuenta_id, monto, descripcion) {
  let saldoCuenta = await consultaSaldo(cuenta_id);
  if (saldoCuenta.saldo < monto) {
    return console.log(
      "No es posible realizar la transacción por saldo insuficiente"
    );
  } else {
    try {
      const t = await sql.transaction();
      const newT = await Transaction.create(
        {
          AccountId: cuenta_id,
          monto: monto,
          descripcion: descripcion,
        },
        { transaction: t }
      );
      saldoCuenta.saldo -= monto;
      await saldoCuenta.save({ transaction: t });
      await t.commit();
      console.log(newT);
    } catch (error) {
      console.error(error);
      await t.rollback();
    }
  }
}

async function nuevaCuenta(monto) {
  const cuenta = await Account.create({ saldo: monto });
  console.log("La cuenta se ha creado con un saldo inicial de " + monto);
  return console.log(cuenta);
}

async function consultaSaldo(id) {
  const res = await Account.findByPk(id);
  return res;
}

async function listarTransaccion() {
  const transacciones = await Transaction.findAll({ limit: 10 });
  return console.log(transacciones);
}

const accion = process.argv[2].toLowerCase();

//1. sincronizar la bd
if (accion == "syncbd") {
  syncBD();
} else if (accion == "nueva_t") {
  const cuenta_id = Number(process.argv[3]);
  const monto = Number(process.argv[4]);
  const descripcion = process.argv[5];

  nuevaTransaccion(cuenta_id, monto, descripcion);
} else if (accion == "listar_t") {
  listarTransaccion();
} else if (accion == "consultar_s") {
  const cuenta_id = Number(process.argv[3]);
  consultaSaldo(cuenta_id);
} else if (accion == "nueva_cuenta") {
  const monto = Number(process.argv[3]);
  nuevaCuenta(monto);
} else {
  console.log("Consulta no existe");
}
