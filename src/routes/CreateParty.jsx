import partyFetch from "../axios/config";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "../hook/useToast";
import "./Form.css";

const CreateParty = () => {
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(0);
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [partyServices, setPartyServices] = useState([]);
  const ongoingRef = useRef(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadServices = async () => {
      const res = await partyFetch.get("/services");
      setServices(res.data);
    };
    loadServices();
  }, []);

  const handleServices = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    const filteredService = services.find((s) => s._id === value);

    setPartyServices((prevServices) => {
      return checked ? [...prevServices, filteredService] : prevServices.filter((s) => s._id !== value);
    });
  };

  const createParty = async (e) => {
    e.preventDefault();
    try {
      const party = { title, author, description, budget, date, image, services: partyServices };
      const res = await partyFetch.post("/parties", party);
      if (res.status === 201) {
        navigate("/");
        useToast(res.data.msg);
      }
    } catch (error) {
      useToast(error.response?.data?.msg || "An error occurred", "error");
    }
  };

  const doStartStopCheck = () => {
    if (ongoingRef.current) {
      ongoingRef.current = false;
      recognitionRef.current.stop();
      document.getElementById("btn_speech").innerHTML = "Transcrever Audio";
    } else {
      ongoingRef.current = true;
      init();
    }
  };

  const init = () => {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "pt-br";

    const words = document.querySelector(".words");
    let p = document.createElement("span");
    words.appendChild(p);

    recognitionRef.current.addEventListener("result", (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      p.textContent = transcript + ", ";
      if (e.results[0].isFinal) {
        p = document.createElement("span");
        words.appendChild(p);
      }
    });

    recognitionRef.current.addEventListener("end", () => {
      if (ongoingRef.current) recognitionRef.current.start();
    });

    recognitionRef.current.start();
  };

  return (
    <div className="form-page">
      <h2>Crie sua próxima Festa</h2>
      <p>Defina o seu orçamento e escolha os serviços</p>
      <form onSubmit={createParty}>
        <label htmlFor="title">
          <span>Nome da festa:</span>
          <input
            id="title"
            type="text"
            placeholder="Seja criativo..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
        </label>
        <label htmlFor="author">
          <span>Anfitrião:</span>
          <input
            id="author"
            type="text"
            placeholder="Quem está dando a festa?"
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
            required
          />
        </label>
        <label>
          <span>Descrição:</span>
          <textarea
            className="words"
            placeholder="Conte mais sobre a festa..."
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
          <button type="button" id="btn_speech" onClick={doStartStopCheck}>
            Transcrever texto
          </button>
        </label>
        <label htmlFor="budget">
          <span>Orçamento:</span>
          <input
            id="budget"
            type="number"
            placeholder="Quanto você pretende investir?"
            onChange={(e) => setBudget(e.target.value)}
            value={budget}
            required
          />
        </label>
        <label htmlFor="date">
          <span>Data:</span>
          <input
            id="date"
            type="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
          />
        </label>
        <label htmlFor="image">
          <span>Imagem:</span>
          <input
            id="image"
            type="text"
            placeholder="Insira a URL de uma imagem"
            onChange={(e) => setImage(e.target.value)}
            value={image}
            required
          />
        </label>
        <div>
          <h2>Escolha os serviços:</h2>
          <div className="services-container">
            {services.length === 0 ? <p>Carregando...</p> : services.map((service) => (
              <div className="service" key={service._id}>
                <img src={service.image} alt={service.name} />
                <p className="service-name">{service.name}</p>
                <p className="service-price">R${service.price}</p>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    value={service._id}
                    onChange={handleServices}
                  />
                  <p>Marque para solicitar</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <input type="submit" value="Criar Festa" className="btn" />
      </form>
    </div>
  );
};

export default CreateParty;
