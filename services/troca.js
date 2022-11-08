module.exports = class Troca {
    constructor(con) {
        this.con = con;
    }

    insertTroca = async ({ data, hora, local, livrodis, livrodes }) => {
        const sqlInsert = 'INSERT INTO troca (data_troca, hora_troca, local_troca, livrodis_troca, livrodes_troca) VALUES (?, ?, ?, ?, ?)';
        this.con.query(sqlInsert, [data, hora, local, livrodis, livrodes], (err, result) => {
            if (err) {
                console.log('Troca NÃO REALIZADA');
            } else {
                console.log('Troca REALIZADA');
            }
        })
    }

    listTroca = async () => {
        const sqlSelect = 'SELECT * FROM troca';

        return new Promise((resolve, reject) => {
            this.con.query(sqlSelect, (err, result) => {
                if (err) {
                    throw err;
                }
                if (result === undefined) {
                    reject(new Error("Error rows is undefined"));
                } else {
                    resolve(result);
                }
            })
        })
    }

    editTroca = async ({ id, data, hora, local, livrodis, livrodes }) => {
        const sqlUpdate = "UPDATE troca SET data_troca = ?, hora_troca = ?, local_troca = ?, livrodis_troca = ?, livrodes_troca = ? WHERE id_troca = ?";

        this.con.query(sqlUpdate, [data, hora, local, livrodis, livrodes, id], (err, result) => {
            if (err) {
                console.log("Update da troca realizado SEM SUCESSO");
                console.log(err);
            }
            else {
                console.log("Update da troca realizado COM SUCESSO");
            }
        })
    }

}