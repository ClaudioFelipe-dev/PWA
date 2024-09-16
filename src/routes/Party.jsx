import partyFetch from "../axios/config";

import { useState, useEffect } from "react";

import { useParams, Link, useNavigate, Navigate } from "react-router-dom";

import useToast from "../hook/useToast";

import {format} from 'date-fns';

import "./Party.css";

const Party = () => {
  const { id } = useParams();

  const [party, setParty] = useState(null);

  const navigate = useNavigate();

  //load party
  useEffect(() => {
    const loadParty = async () => {
      const res = await partyFetch.get(`/parties/${id}`);

      console.log(res.data);

      setParty(res.data);
    };

    loadParty();
  }, []);

  // Delete
  const hadleDelete = async () => {
    const res = await partyFetch.delete(`/parties/${id}`);

    if (res.status === 200) {
      navigate("/");
      useToast(res.data.msg)
    }
  };

  if (!party) return <p>Carregando...</p>;

  const formatteDate = party.date ? format(new Date(party.date),'dd/MM/yyyy') : 'Data nao disponivel  '

  return (
    <div className="party">
      <h1>{party.title}</h1>

      <div className="actions-container">
        <Link to={`/party/edit/${party._id}`} className="btn">Editar</Link>
        <button onClick={hadleDelete} className="btn-secondary">Excluir</button>
      </div>
      <p>Orcamento: R${party.budget}</p>
      <p><strong>Data da Festa:{formatteDate}</strong></p>
      <h3>Servicos Contradado:</h3>
      <div className="services-container">
        {party.services.map((service) => (
          <div className="service" key={service._id}>
            <img src={service.image} alt={service.className} />
            <p>{service.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Party;
