import React from 'react';
import * as SQLite from 'expo-sqlite';

export const DatabaseManager = () => {
  const db = SQLite.openDatabase('reachliao.db');

  //When DatabaseManager is instantiated, check if the favourites TABLE already exists, if not create one.
  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS favourites (id integer primary key not null, name text, waypoints text);',
      );
    });
  }, []);

  //Removes the alarm from DB based on its ID
  const removeAlarm = (id) => {
    return db.transaction((tx) => {
      tx.executeSql('DELETE FROM favourites WHERE id=(?)', [id]);
    });
  };

  const insertAlarm = (name, waypoints) => {
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO favourites (name, waypoints) values (?,?)', [
        name,
        JSON.stringify(waypoints),
      ]);
    });
  };

  return {
    insertAlarm,
    removeAlarm,
    db
  };

  //=====================================================================
  //Debugging functions to test the DB

  // const clearTable = () => {
  //   db.transaction((tx) => tx.executeSql('DELETE FROM favourites'));
  // };

  // const dropTable = () => {
  //   db.transaction((tx) => tx.executeSql('DROP TABLE favourites'));
  // };

  // const printTable = () => {
  //   db.transaction((tx) => {
  //     tx.executeSql('SELECT * from favourites', [], (_, { rows }) =>
  //       console.log(JSON.stringify(rows)),
  //     );
  //   });
  // };
  //=====================================================================
};
export default DatabaseManager;
