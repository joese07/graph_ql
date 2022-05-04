import "./App.css";
import React from "react";
import {
  gql,
  useQuery,
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import Header from "./component/Header";
import "../src/component/Home.css";
import { useState } from "react/cjs/react.development";

const getPassenger = gql`
  query MyQuery {
    passenger {
      id
      nama
      umur
      jenis_kelamin
    }
  }
`;

const getPassengerLazy = gql`
  query MyQuery($id: Int!) {
    passenger(where: { id: { _eq: $id } }) {
      id
      nama
      umur
      jenis_kelamin
    }
  }
`;

const insertPassenger = gql`
  mutation InsertPassengers(
    $jenis_kelamin: String
    $nama: String
    $umur: String
  ) {
    insert_passenger(
      objects: { nama: $nama, umur: $umur, jenis_kelamin: $jenis_kelamin }
    ) {
      affected_rows
    }
  }
`;

const deletePassenger = gql`
  mutation Delete($id: Int) {
    delete_passenger(where: { id: { _eq: $id } }) {
      affected_rows
      returning {
        id
        nama
        jenis_kelamin
        umur
      }
    }
  }
`;

const subscriptionPassenger = gql`
  subscription MySubscription {
    passenger {
      id
      nama
      umur
      jenis_kelamin
    }
  }
`;

function App() {
  const { data: dataQuery, loading, error } = useQuery(getPassenger);
  const [getTodo, { data: dataLazy, loading: loadingLazy }] =
    useLazyQuery(getPassengerLazy);
  const [dataNama, setDataNama] = useState("");
  const [dataJk, setDataJk] = useState("");
  const [dataUmur, setDataUmur] = useState("");
  const [deleteData, { loading: loadingDelete }] = useMutation(
    deletePassenger,
    {
      refetchQueries: [getPassenger],
    }
  );
  const [InsertPassengers, { loading: loadinginsert }] = useMutation(
    insertPassenger,
    { refetchQueries: [getPassenger] }
  );

  const [id, setId] = useState();

  // const result = useQuery(subscriptionPassenger);

  const { data, loading: loadingSubs } = useSubscription(
    subscriptionPassenger,
    {
      refetchQueries: [getPassenger],
    }
  );

  if (loading) return <p>Loading...</p>;

  const handleChange = (e) => {
    console.log("target", e.target.value);
    setId(e.target.value);
  };

  const handleClick = () => {
    getTodo({ variables: { id: id } });
  };

  const handleTodoChangeNama = (e) => {
    setDataNama(e.target.value);
    console.log(" dataTodos ", dataNama);
  };

  const handleTodoChangeJk = (e) => {
    setDataJk(e.target.value);
    console.log(" dataTodos ", dataJk);
  };
  const handleTodoChangeUmur = (e) => {
    setDataUmur(e.target.value);
    console.log(" dataTodos ", dataUmur);
  };
  const handleClickSubmit = () => {
    InsertPassengers({
      variables: {
        nama: dataNama,
        umur: dataUmur,
        jenis_kelamin: dataJk,
      },
    });
  };

  // const handleDeleteSubmit = () => {
  //   deleteData({ variables: { id: id } });
  // };

  console.log(dataLazy);

  console.info(dataQuery);

  // console.log(result);

  return (
    <div className="header">
      <Header />
      <table cellPadding="5px" cellSpacing="0" style={{ margin: "auto" }}>
        <thead bgcolor="red">
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Umur</th>
            <th>Jenis Kelamin</th>
            <th bgcolor="white" className="removeBorder"></th>
          </tr>
        </thead>

        {dataQuery.passenger.map((passengers) => (
          <tr>
            <td>{passengers.id}</td>
            <td>{passengers.nama}</td>

            <td>{passengers.umur}</td>

            <td>{passengers.jenis_kelamin}</td>
            <td className="removeBorder">
              <button
                type="submit"
                onClick={() => {
                  deleteData({ variables: { id: passengers.id } });
                }}
              >
                hapus
              </button>
            </td>
          </tr>
        ))}
      </table>
      <p></p>
      <h3>Masukkan ID untuk mencari ID Spesifik</h3>
      <input type="text" onChange={handleChange} />
      <button type="submit" onClick={handleClick}>
        submit
      </button>
      <p></p>

      <table cellPadding="5px" cellSpacing="0" style={{ margin: "auto" }}>
        <thead bgcolor="red">
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Umur</th>
            <th>Jenis Kelamin</th>
            <th bgcolor="white" className="removeBorder"></th>
          </tr>
        </thead>
        {dataLazy?.passenger.map((passengers) => (
          <tr>
            <td>{passengers.id}</td>
            <td>{passengers.nama}</td>

            <td>{passengers.umur}</td>

            <td>{passengers.jenis_kelamin}</td>
          </tr>
        ))}
      </table>
      <p></p>
      <h3>Masukkan data baru</h3>

      <input
        type="text"
        placeholder="Nama"
        onChange={handleTodoChangeNama}
      ></input>
      <br></br>
      <input
        type="text"
        placeholder="Jenis Kelamin"
        onChange={handleTodoChangeJk}
      ></input>
      <br></br>
      <input
        type="text"
        placeholder="Umur"
        onChange={handleTodoChangeUmur}
      ></input>
      <br></br>
      <button type="submit" onClick={handleClickSubmit}>
        Submit
      </button>

      <p></p>
    </div>
  );
}

// function App() {
//   return (
//     <div className="App">
//       <Home />
//     </div>
//   );
// }

export default App;
