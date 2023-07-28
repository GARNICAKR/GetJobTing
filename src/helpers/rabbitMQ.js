const amqp = require("amqplib");
const Jobs = require("../models/Jobs");
const Aplicants = require("../models/Aplicants");
const UserEmployee = require("../models/UsersEmployee");
const User = require("../models/Users");
const UserCompany = require("../models/userCompany");
const messages = [];
let RabbitMQ = {};
RabbitMQ.Publish = (headers, message) => {
  const routingKey = "";
  const exchangeType = "headers";
  const exchangeName = "GetJobTing";
  const delay = 0;
  let bandMessageSave=false;
  const sendMessage = async (connection, channel, message) => {
    try {
      channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { headers, persistent: true }
      );
      console.log(`Sent message to "${exchangeName}" exchange`, message);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Fail sending message to "${exchangeName}" exchange, "${JSON.stringify(
          message
        )}"`
      );
    }
  };

  const backOffMinTime1MaxTime4 = backOff(1)(4);
  const main = async (messages, wait) => {
    console.log("Mensaje",message);
    try {
      const connection = await amqp.connect("amqps://oeqsnopo:El_ALlnSw-9GDfSr9oAZTrGp29wzuhD0@chimpanzee.rmq.cloudamqp.com/oeqsnopo");
      const channel = await connection.createChannel();

      channel.assertExchange(exchangeName, exchangeType, {
        durable: true,
      });

      const sendMessageTimeout = () => {
        if (messages.length > 0) {
          setTimeout(
            sendMessageBackOff,
            delay,
            connection,
            channel,
            messages.shift()
          );

          sendMessageTimeout();
          return;
        }
        setTimeout(sendMessageBackOff, delay, connection, channel, message);
      };

      const onErrorEnd = (_, ...args) => {
        // connection.close()
        messages.push(message);
        bandMessageSave=true;
        main(messages);
      };

      const sendMessageBackOff = backOffMinTime1MaxTime4(
        sendMessage,
        onErrorEnd,
        console.log,
        console.error
      );

      sendMessageTimeout();
    } catch (error) {
      let aux;
      if (wait) {
        aux = wait;
        if (aux <= 30) {
          console.log("Espera:",wait);
          console.error("Error connecting to RabbitMQ server:", error.message);
          aux += 1;
          setTimeout(() => {
            main(messages, aux * 1.5);
          }, wait * 1000);
        } else {
          if(!bandMessageSave)
            messages.push(message);
          console.log(error);
        }
      } else {
        
        main(messages, 1);
      }
    }
  };

  main(messages).catch((error) => {
    console.error(error);
    process.exit(1);
  });
};
///Consume
RabbitMQ.Consume = async () => {
  console.log("entro en consume")
  const pattern = "";
  const queue = "colaGetJobTing";
  const exchangeType = "headers";
  const exchangeName = "GetJobTing";

  const backOffMinTime1MaxTime4 = backOff(1)(4);
  const main = async (wait) => {
    try {
      console.log("intentando Conectar");
      const connection = await amqp.connect("amqps://oeqsnopo:El_ALlnSw-9GDfSr9oAZTrGp29wzuhD0@chimpanzee.rmq.cloudamqp.com/oeqsnopo");

      console.log("conectadoRabbit");
      const channel = await connection.createChannel();

      channel.prefetch(1);

      channel.on("close", () => {
        mainBackOff();
       
      });

      await channel.assertQueue(queue, {
        durable: true,
      });

      await channel.assertExchange(exchangeName, exchangeType, {
        durable: true,
      });

      await channel.bindQueue(queue, exchangeName, pattern);

      channel.consume(queue, (message) => {
        const content = JSON.parse(message.content.toString());
        const tabla = message.properties.headers.tabla;
        const peticion = message.properties.headers.peticion;
        switch (tabla) {
          case "User": {
            switch (peticion) {
              case "New":
                async function GuardarN() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  const newUser = new User(content);
                  newUser.password = await newUser.encryptPassword(content.password);
                  await newUser.save();
                } 
                try {
                  GuardarN();
                } catch (error) {
                  console.error(error);
                }

                break;
              case "Edit":
                async function GuardarE() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                }
                try {
                  GuardarE();
                } catch (error) {
                  console.error(error);
                }
                break;
              case "Delete":
                async function GuardarD() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  await User.findByIdAndDelete(content._id);
                }
                try {
                  GuardarD();
                } catch (error) {
                  console.error(error);
                }
                break;
              default:
                console.log("Opción no válida");
                break;
            }
            break;
          }
          case "UserCompany": {
            switch (peticion) {
              case "New":
                async function GuardarN() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  
                  const newUser = new User(content.user);
                  newUser.password = await newUser.encryptPassword(content.user.password);
                  
                  await newUser.save();
                const newUserCompany = new UserCompany({
                  idUser: newUser._id,
                  nameCompany:content.nameCompany,
                  description:content.description,
                  rfc:content.rfc,
                  sat:content.sat,
                  location:content.location,
                  logo:content.logo,
                });
                await newUserCompany.save();
                } 
                try {
                  GuardarN();
                } catch (error) {
                  console.error(error);
                }

                break;
              case "Edit":
                async function GuardarE() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  await UserCompany.findByIdAndUpdate(content._id, {
                    nameCompany:content.nameCompany,
                    description:content.description,
                    rfc:content.rfc,
                    sat:content.sat,
                    location:content.location,
                  });
                }
                try {
                  GuardarE();
                } catch (error) {
                  console.error(error);
                }
                break;
              case "Delete":
                async function GuardarD() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  await User.findByIdAndDelete(content._id);
                }
                try {
                  GuardarD();
                } catch (error) {
                  console.error(error);
                }
                break;
              default:
                console.log("Opción no válida");
                break;
            }
            break;
          }
          case "UserEmployee": {
            switch (peticion) {
              case "New":
                async function GuardarN(){
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  const newUser = new User(content.user);
                  newUser.password = await newUser.encryptPassword(content.user.password);
                  
                  await newUser.save();
                  const newUserEmployee = new UserEmployee({
                    idUser: newUser._id,
                    name:content.name,
                    last_name:content.last_name,
                    phone_number:content.phone_number,
                    location:content.location,
                    CV:content.CV,
                    photo:content.photo
                    
                  });
                  await newUserEmployee.save();
                }
                try {
                  GuardarN();
                } catch (error) {
                  console.error(error);
                }
                
                break;
              case "AddPostulation":
                async function GuardarAd(){
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  await UserEmployee.findByIdAndUpdate(content.idEmployee,{$push:{postulations:content.idJob}})
                }
                try {
                  GuardarAd();
                } catch (error) {
                  console.error(error);
                }
                break;
                case "Edit":
                  async function GuardarE(){
                    console.log(`Received message from "${queue}" queue`);
                    console.log(content);
                    await UserEmployee.findByIdAndUpdate(content._id,content.Employee);
                  }
                  try {
                    GuardarE();
                  } catch (error) {
                    console.error(error);
                  }
                  break;
              case "Delete":
                async function GuardarD(){
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                }
                try {
                  GuardarD();
                } catch (error) {
                  console.error(error);
                }
                break;
              default:
                console.log("Opción no válida");
                break;
            }
            break;
          }
          case "Jobs": {
            switch (peticion) {
              case "New":
                async function GuardarN() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  const newJob = new Jobs(content);
                  await newJob.save();
                  const headers2 = {
                    tabla: "Aplicant",
                    peticion: "New",
                    "x-match": "all",
                  };
                  const idJob = newJob._id;
                  RabbitMQ.Publish(headers2, {
                    idJob,
                  });
                }
                try {
                  GuardarN();
                } catch (error) {
                  console.error(error);
                }

                break;
              case "Edit":
                async function GuardarE() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  await Jobs.findByIdAndUpdate(content._id, content.job);
                }
                try {
                  GuardarE();
                } catch (error) {
                  console.error(error);
                }
                break;
              case "Delete":
                async function GuardarD() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  await Jobs.findByIdAndDelete(content._id);
                }
                try {
                  GuardarD();
                } catch (error) {
                  console.error(error);
                }
                break;
              default:
                console.log("Opción no válida");
                break;
            }
            break;
          }
          case "Aplicant":{
            switch (peticion) {
              case "New":
                async function GuardarN() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content.idJob);
                  const newAplicant = new Aplicants({ idJobs: content.idJob });
                  await newAplicant.save();
                }
                try {
                  GuardarN();
                } catch (error) {
                  console.error(error);
                }
                break;
              case "Edit":
                async function GuardarE() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  await Aplicants.findByIdAndUpdate(content._id, { $push: { idsEmployee: content.idsEmployee}});
                }
                try {
                  GuardarE();
                } catch (error) {
                  console.error(error);
                }
                
                break;
                case "EditStatus":
                async function GuardarES() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content);
                  const aplicant = await Aplicants.findOne({ idJobs:content.idJob });

                  aplicant.idsEmployee = aplicant.idsEmployee.map(item => {
                    if (item.idEmployee === content.idEmployee) {
                      return { idEmployee: item.idEmployee, status: content.status};
                    } else {
                      return item;
                    }
                  });
                   await aplicant.save();
                }
                try {
                  GuardarES();
                } catch (error) {
                  console.error(error);
                }
                
                break;
              case "Delete":
                async function GuardarD() {
                  console.log(`Received message from "${queue}" queue`);
                  console.log(content._id);
                  await Aplicants.findByIdAndDelete(content._id);
                }
                try {
                  GuardarD();
                } catch (error) {
                  console.error(error);
                }
                break;
                case "DeleteEmployee":
                  async function GuardarDE() {
                    console.log(`Received message from "${queue}" queue`);
                    console.log(content);
                    const aplicants = await Aplicants.findOne({ idJobs:content.idJob });
                    aplicants.idsEmployee = aplicants.idsEmployee.filter(item => item.idEmployee !== content.idEmployee);
                    await aplicants.save();
                  }
                  try {
                    GuardarDE();
                  } catch (error) {
                    console.error(error);
                  }
                  break;
                  
              default:
                console.log("Opción no válida");
                break;
            }
            break;
          }
          case "Prueba":
                    console.log(`Received message from "${queue}" queue`);
                    console.log(content);
                    break;
          default:
            console.log("Opción no válida");
            break;
        }
        channel.ack(message);
      });

    } catch (error) {
      let aux;
      if (wait) {
        aux = wait;
        if (aux <= 30) {
          console.log("Espera:",wait);
          console.error("Error connecting to RabbitMQ server:", error.message);
          aux += 1;
          setTimeout(() => {
            main(aux * 1.5);
          }, wait * 1000);
        } else {
          setTimeout(() => {
            main(aux);
          }, wait * 1000);
        }
      } else {
        main(1);
      }
    }
  };

  const onErrorEnd = (error) => {
    console.error(error);
    mainBackOff().catch(console.error);
  };
  
  const mainBackOff = backOffMinTime1MaxTime4(
    main,
    onErrorEnd,
    console.log(""),
    console.error
  );
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
};
module.exports = RabbitMQ;

//#region BackUP
const increaseBackOffTime = (currentBackoffTime) => currentBackoffTime * 2;
const calculateBackOffDelayMs = (backoffTime) =>
  1000 * (backoffTime + Math.random());

const backOff =
  (minTime) => (maxTime) => (fn, onErrorEnd, onSuccess, onError) => {
    const _run =
      (currentTime) =>
      (...args) => {
        setTimeout(async () => {
          try {
            const result = await fn(...args);

            if (onSuccess) {
              onSuccess(result);
            }
          } catch (error) {
            if (currentTime >= maxTime) {
              if (onErrorEnd) {
                onErrorEnd(error, ...args);
              }
              return;
            }

            if (onError) {
              onError(error);
            }

            _run(increaseBackOffTime(currentTime))(...args);
          }
        }, calculateBackOffDelayMs(currentTime));
      };

    return _run(minTime);
  };
//#endregion