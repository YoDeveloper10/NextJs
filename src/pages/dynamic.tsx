// pages/dynamic.tsx

import { GetServerSideProps, NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";

interface ApiResponse {
  name: string;
  timestamp: Date;
}

export const getServerSideProps: GetServerSideProps = async () => {
  //Coleta os dados da api, nesse caso hello, e transforma para json.
  const serverSideData: ApiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APIURL}/api/hello`
  ).then((res) => res.json());
  return {
    props: {
      serverSideData,
    },
  };
};
//A prop children é obrigatória ao utilizar a tipagem de NextPage
const Dynamic: NextPage = (props: {
  children?: ReactNode;
  serverSideData?: ApiResponse;
}) => {
  const [clientSideData, setClientSideDate] = useState<ApiResponse>();
  const fetchData = async () => {
    const data = await fetch("/api/hello").then((res) => res.json());
    setClientSideDate(data);
  };
  //Ao renderizar a página, a fetchData é acionada , peganndo os dados da api na hora que a página renderizou causando um delay, além de problemas GRAVES no SEO.
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container tag="main">
      <h1 className="my-5">Como funcionam as renderizações do Next.js</h1>

      <Row>
        <Col>
          {/*Dessa forma esses dados ja vão está na página, resolvendo em partes o problema do SEO */}
          <h3>Gerado no servidor:</h3>
          <h2>{props.serverSideData?.timestamp.toString()}</h2>
        </Col>

        <Col>
          {/* A varíavel do cliente tem um pequeno delay, pois ela so veio ocorrer depois que chegou no cliente e nesse caso a outra ja vem do servidor */}
          <h3>Gerado no cliente:</h3>
          <h2>{clientSideData?.timestamp.toString()}</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Dynamic;
