import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = styled.div`
  background: linear-gradient(135deg, #FDF5E6, #FFE4B5);
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  @media (max-width: 768px) {
    height: 1100px;
}
`;

const Container = styled.div`
  width: 300px;
  height: 280px;
  position: absolute;
  top: calc(50% - 140px);
  left: calc(50% - 150px);

  @media (max-width: 768px) {
    display: none;
`;

const CoffeeHeader = styled.div`
  width: 100%;
  height: 80px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: brown;
  border-radius: 10px;

  @media (max-width: 768px) {
    height: 60px;
  }
`;

const CoffeeButton = styled.div`
  width: 25px;
  height: 25px;
  position: absolute;
  top: 25px;
  background-color: #282323;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    top: 20px;
  }
`;

const CoffeeButtonOne = styled(CoffeeButton)`
  left: 15px;

  @media (max-width: 768px) {
    left: 10px;
  }
`;

const CoffeeButtonTwo = styled(CoffeeButton)`
  left: 50px;

  @media (max-width: 768px) {
    left: 40px;
  }
`;

const CoffeeDisplay = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: calc(50% - 25px);
  left: calc(50% - 25px);
  border-radius: 50%;
  background-color: green;
  border: 5px solid #43beae;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    top: calc(50% - 20px);
    left: calc(50% - 20px);
  }
`;

const CoffeeDetails = styled.div`
  width: 8px;
  height: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #9b9091;
  box-shadow: -12px 0 0 #9b9091, -24px 0 0 #9b9091;

  @media (max-width: 768px) {
    height: 15px;
    top: 8px;
    right: 8px;
  }
`;

const CoffeeMedium = styled.div`
  width: 90%;
  height: 160px;
  position: absolute;
  top: 80px;
  left: calc(50% - 45%);
  background-color: #dc6565;

  @media (max-width: 768px) {
    height: 120px;
    top: 60px;
  }
`;

const CoffeeExit = styled.div`
  width: 60px;
  height: 20px;
  position: absolute;
  top: 0;
  left: calc(50% - 30px);
  background-color: #231f20;

  @media (max-width: 768px) {
    width: 50px;
    height: 15px;
    left: calc(50% - 25px);
  }
`;

const CoffeeExitBefore = styled(CoffeeExit)`
  height: 5px;
  top: 5px;
  left: calc(50% - 30px);

  @media (max-width: 768px) {
    height: 4px;
    top: 4px;
    left: calc(50% - 25px);
  }
`;

const CoffeeExitAfter = styled(CoffeeExit)`
  height: 5px;
  top: 15px;
  left: calc(50% - 30px);

  @media (max-width: 768px) {
    height: 4px;
    top: 12px;
    left: calc(50% - 25px);
  }
`;

const CoffeeArm = styled.div`
  width: 70px;
  height: 20px;
  position: absolute;
  top: 15px;
  right: 25px;
  background-color: #231f20;

  @media (max-width: 768px) {
    width: 60px;
    height: 15px;
    top: 12px;
    right: 20px;
  }
`;

const CoffeeArmBefore = styled.div`
  width: 15px;
  height: 5px;
  position: absolute;
  top: 7px;
  left: -15px;
  background-color: #9e9495;

  @media (max-width: 768px) {
    width: 12px;
    height: 4px;
    top: 6px;
    left: -12px;
  }
`;

const CoffeeCup = styled.div`
  width: 80px;
  height: 47px;
  position: absolute;
  bottom: 0;
  left: calc(50% - 40px);
  background-color: #fff;
  border-radius: 0 0 70px 70px / 0 0 110px 110px;

  @media (max-width: 768px) {
    width: 60px;
    height: 35px;
    left: calc(50% - 30px);
  }
`;

const CoffeeCupAfter = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 6px;
  right: -13px;
  border: 5px solid #fff;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 15px;
    height: 15px;
    top: 5px;
    right: -10px;
  }
`;

const keyframesLiquid = keyframes`
  0% { height: 0px; opacity: 1; }
  5% { height: 0px; opacity: 1; }
  20% { height: 62px; opacity: 1; }
  95% { height: 62px; opacity: 1; }
  100% { height: 62px; opacity: 0; }
`;

const CoffeeLiquid = styled.div`
  width: 6px;
  height: 63px;
  opacity: 0;
  position: absolute;
  top: 50px;
  left: calc(50% - 3px);
  background-color: #74372b;
  animation: ${keyframesLiquid} 4s 4s linear infinite;

  @media (max-width: 768px) {
    height: 50px;
    top: 40px;
  }
`;

const keyframesSmokeOne = keyframes`
  0% { bottom: 20px; opacity: 0; }
  40% { bottom: 50px; opacity: 0.5; }
  80% { bottom: 80px; opacity: 0.3; }
  100% { bottom: 80px; opacity: 0; }
`;

const keyframesSmokeTwo = keyframes`
  0% { bottom: 40px; opacity: 0; }
  40% { bottom: 70px; opacity: 0.5; }
  80% { bottom: 80px; opacity: 0.3; }
  100% { bottom: 80px; opacity: 0; }
`;

const CoffeeSmoke = styled.div`
  width: 8px;
  height: 20px;
  position: absolute;
  border-radius: 5px;
  background-color: #e3dada;
`;

const CoffeeSmokeOne = styled(CoffeeSmoke)`
  opacity: 0;
  bottom: 50px;
  left: 102px;
  animation: ${keyframesSmokeOne} 3s 4s linear infinite;

  @media (max-width: 768px) {
    bottom: 40px;
    left: 80px;
  }
`;

const CoffeeSmokeTwo = styled(CoffeeSmoke)`
  opacity: 0;
  bottom: 70px;
  left: 118px;
  animation: ${keyframesSmokeTwo} 3s 5s linear infinite;

  @media (max-width: 768px) {
    bottom: 60px;
    left: 95px;
  }
`;

const CoffeeSmokeThree = styled(CoffeeSmoke)`
  opacity: 0;
  bottom: 65px;
  right: 118px;
  animation: ${keyframesSmokeTwo} 3s 6s linear infinite;

  @media (max-width: 768px) {
    bottom: 55px;
    right: 95px;
  }
`;

const CoffeeSmokeFour = styled(CoffeeSmoke)`
  opacity: 0;
  bottom: 50px;
  right: 102px;
  animation: ${keyframesSmokeOne} 3s 5s linear infinite;

  @media (max-width: 768px) {
    bottom: 40px;
    right: 80px;
  }
`;

const CoffeeFooter = styled.div`
  width: 95%;
  height: 15px;
  position: absolute;
  bottom: 25px;
  left: calc(50% - 47.5%);
  background-color: brown;
  border-radius: 10px;

  @media (max-width: 768px) {
    height: 12px;
    bottom: 20px;
  }
`;

const CoffeeFooterAfter = styled.div`
  width: 106%;
  height: 26px;
  position: absolute;
  bottom: 0px;
  left: -8px;
  background-color: #000;

  @media (max-width: 768px) {
    height: 20px;
  }
`;

const CoffeeTap = styled.div`
  width: 49px;
  height: 30px;
  position: absolute;
  top: 20px;
  left: calc(50% - 22px);
  background-color: #231f20;
  border-radius: 0 0 10px 10px;

  @media (max-width: 768px) {
    width: 40px;
    height: 25px;
    top: 15px;
    left: calc(50% - 20px);
  }
`;

const CoffeeTapNozzle = styled.div`
  width: 10px;
  height: 10px;
  position: absolute;
  bottom: -10px;
  left: calc(50% - 7px);
  background-color: #231f20;
  border-radius: 0%;

  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
    bottom: -8px;
    left: calc(50% - 4px);
  }
`;

const CardsContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-between;
  width: 1000px;

  @media (max-width: 1050px) {
    width: 90%;
    gap: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    top: 40%;
    margin-top: 100px;
  }
`;

const CardColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const Card = styled.div`
  width: 250px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border-radius: 5%;
  background: #fff;
  padding: 10px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 200px;
    height: 240px;
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-bottom: 1px solid #eee;

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const CardContent = styled.div`
  margin-top: 20px;
  text-align: center;
  font-family: "Arial", sans-serif;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: center;
  flex-grow: 1;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 5px 0 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BuyNowButton = styled.button`
  margin-top: 5px;
  margin-bottom: 16px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background: #ff6f61;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #ff4b39;
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(1px);
    background: #e84331;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 16px;
  }
`;

function PremiumBeans() {
  const beans = [
    {
      id: 1,
      title: "Arabica Bliss",
      description: "A smooth, aromatic blend with a hint of chocolate.",
      image: "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 2,
      title: "Robusta Roast",
      description: "Bold, rich flavor with high caffeine content.",
      image: "https://images.pexels.com/photos/1556665/pexels-photo-1556665.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 3,
      title: "Espresso Elite",
      description: "Intense and full-bodied, perfect for espresso lovers.",
      image: "https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 4,
      title: "Colombian Charm",
      description: "A bright, fruity coffee from the hills of Colombia.",
      image: "https://images.pexels.com/photos/4109748/pexels-photo-4109748.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  return (
    <Loader>
      <CardsContainer>
        <CardColumn>
          {beans.slice(0, 2).map((bean) => (
            <Card key={bean.id}>
              <CardImage style={{ backgroundImage: `url(${bean.image})` }} />
              <CardContent>
                <CardTitle>{bean.title}</CardTitle>
                <CardDescription>{bean.description}</CardDescription>
                <BuyNowButton>Buy Now</BuyNowButton>
              </CardContent>
            </Card>
          ))}
        </CardColumn>
        <CardColumn>
          {beans.slice(2).map((bean) => (
            <Card key={bean.id}>
              <CardImage style={{ backgroundImage: `url(${bean.image})` }} />
              <CardContent>
                <CardTitle>{bean.title}</CardTitle>
                <CardDescription>{bean.description}</CardDescription>
                <BuyNowButton>Buy Now</BuyNowButton>
              </CardContent>
            </Card>
          ))}
        </CardColumn>
      </CardsContainer>
      <Container>
        <CoffeeHeader>
          <CoffeeButtonOne />
          <CoffeeButtonTwo />
          <CoffeeDisplay />
          <CoffeeDetails />
        </CoffeeHeader>
        <CoffeeMedium>
          <CoffeeExitBefore />
          <CoffeeExit />
          <CoffeeExitAfter />
          <CoffeeArm>
            <CoffeeArmBefore />
          </CoffeeArm>
          <CoffeeLiquid />
          <CoffeeSmokeOne />
          <CoffeeSmokeTwo />
          <CoffeeSmokeThree />
          <CoffeeSmokeFour />
          <CoffeeCup>
            <CoffeeCupAfter />
          </CoffeeCup>
          <CoffeeTap>
            <CoffeeTapNozzle />
          </CoffeeTap>
        </CoffeeMedium>
        <CoffeeFooter />
        <CoffeeFooterAfter />
      </Container>
    </Loader>
  );
}

export default PremiumBeans;