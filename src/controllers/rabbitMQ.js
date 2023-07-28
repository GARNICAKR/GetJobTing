const amqp = require("amqplib");

module.exports = {

  sendMessage: (req, res) => {


    async function sendMessage() {
      try {
        const connection = await amqp.connect("amqp://localhost"); // Establece la conexión con RabbitMQ
        const channel = await connection.createChannel(); // Crea un canal para enviar y recibir mensajes

        const queue = "mi_cola"; // Nombre de la cola a la que enviar el mensaje
        const message = "¡Hola, RabbitMQ!2"; // Mensaje a enviar

        await channel.assertQueue(queue); // Asegura que la cola exista

        channel.sendToQueue(queue, Buffer.from(message)); // Envía el mensaje a la cola

        console.log("Mensaje enviado con éxito");

        setTimeout(() => {
          connection.close(); // Cierra la conexión después de un tiempo determinado
        }, 500);
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
      }
    }

    sendMessage();
    res.render("RabbitMQ/send");
  },
  recibeMessage: async (req, res) => {

        const connection = await amqp.connect("amqp://localhost"); // Establece la conexión con RabbitMQ
        const channel = await connection.createChannel(); // Crea un canal para enviar y recibir mensajes

        const queue = "mi_cola"; // Nombre de la cola a la que enviar el mensaje
        await channel.assertQueue(queue); // Asegura que la cola exista
        await channel.consume(queue,
          function (msg) {
            console.log(" [x] Received %s", msg.content.toString());
          },
        );
           
      

    sendMessage();
    setTimeout(() => {
      connection.close(); // Cierra la conexión después de un tiempo determinado
    }, 500);
    res.render("RabbitMQ/recibe");
  },
  Practica1Suscriber: async (req, res) => {
    const tipo="Suscriber"
        function intensive(){
          i=1e9;
          while(i--){}
        }
        const connection = await amqp.connect("amqp://localhost"); // Establece la conexión con RabbitMQ
        const channel = await connection.createChannel(); // Crea un canal para enviar y recibir mensajes
        const mensajes=[];
        const queue = "mi_cola"; // Nombre de la cola a la que enviar el mensaje
        await channel.assertQueue(queue); // Asegura que la cola exista
        await channel.consume(queue,
          function (msg) {
           // intensive();
            console.log(" [x] Received %s", msg.content.toString());
            mensajes.push(JSON.parse(msg.content.toString()))
          channel.ack(msg)
          }
        );
        setTimeout(() => {
          connection.close(); // Cierra la conexión después de un tiempo determinado
        }, 5000);

    res.render("RabbitMQ/sucriber",{tipo,mensajes});
  },
  Practica1Publisher: async (req, res) => {
    const tipo="Publisher"
      const connection = await amqp.connect("amqp://localhost"); // Establece la conexión con RabbitMQ
      const channel = await connection.createChannel(); // Crea un canal para enviar y recibir mensajes

        const queue = "mi_cola"; // Nombre de la cola a la que enviar el mensaje
        await channel.assertQueue(queue); // Asegura que la cola exista
       
        const messagesCount=6;
        const wait=400;
      function sleep(ms){
        return new Promise((resolve)=>{
          setTimeout(resolve,ms)
        })
      }
      async function sleepLoop(num){
        let message;
        for(let i=0;i<num;i++){
          await sleep(wait);
          message={
            id:i,
            text:`Hola ${i}`  
          }
          channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)),{
           persistent:true
          });
          console.log("mensaje",i,"Enviado");
        }
      }
      sleepLoop(messagesCount);
    setTimeout(() => {
      connection.close(); // Cierra la conexión después de un tiempo determinado
    }, messagesCount*wait*1.2);
    res.render("RabbitMQ/publisher",{tipo});
  },
  Practica2FanoutSuscriber: async (req, res) => {
    const tipo="ExchangueSuscriber"
    function intensive(){
      i=1e9;
      while(i--){}
    }
    const connection = await amqp.connect("amqp://localhost"); // Establece la conexión con RabbitMQ
    const channel = await connection.createChannel(); // Crea un canal para enviar y recibir mensajes
    const mensajes=[];
    const queue = "mi_cola2"; // Nombre de la cola a la que enviar el mensaje
    const key="123"
    const pattern=""
   const  headers={
      tabla:"jobs",
      peticion:"New",
      'x-match':'all'
    };
    //const exchangeType="fanout";
    //const exchangeType="direct";
    //const exchangeType="topic";
    const exchangeType="headers";
    //const exchangeName='my-fanout';
    //const exchangeName='my-direct';
    //const exchangeName='my-topic';
    const exchangeName='my-header';
    await channel.assertQueue(queue); // Asegura que la cola exista
    await channel.bindQueue(queue,exchangeName,pattern,headers)
    //await channel.assertExchange(exchangeName,exchangeType)
    await channel.consume(queue,
      function (msg) {
       // intensive();
        console.log(" [x] Received %s", msg.content.toString());
        mensajes.push(JSON.parse(msg.content.toString()))
      channel.ack(msg)
      }
    );
    setTimeout(() => {
      connection.close(); // Cierra la conexión después de un tiempo determinado
    }, 5000);

res.render("RabbitMQ/sucriber",{tipo,mensajes});
},
Practica2FanoutPublisher: async (req, res) => {
  const tipo="FanoutPublisher"
  const connection = await amqp.connect("amqp://localhost"); // Establece la conexión con RabbitMQ
  const channel = await connection.createChannel(); // Crea un canal para enviar y recibir mensajes
  const key=""
  const  headers={
    tabla:"jobs",
    peticion:"New",
    'x-match':'all'
  };
 //const exchangeType="fanout";
    //const exchangeType="direct";
    //const exchangeType="topic";
    const exchangeType="headers";
    //const exchangeName='my-fanout';
    //const exchangeName='my-direct';
    //const exchangeName='my-topic';
    const exchangeName='my-header';
  await channel.assertExchange(exchangeName,exchangeType)
    const messagesCount=6;
    const wait=400;
  function sleep(ms){
    return new Promise((resolve)=>{
      setTimeout(resolve,ms)
    })
  }
  async function sleepLoop(num){
    let message;
    for(let i=0;i<num;i++){
      await sleep(wait);
      message={
        id:i,
        text:`Hola ${i}`  
      }
      channel.publish(exchangeName,
       key,
         Buffer.from(JSON.stringify(message)),{
           headers,
       persistent:true
      });
      console.log("mensaje",i,"Enviado");
    }
  }
  sleepLoop(messagesCount);
setTimeout(() => {
  connection.close(); // Cierra la conexión después de un tiempo determinado
}, messagesCount*wait*1.2);
res.render("RabbitMQ/publisher",{tipo});
},
BackOffPublisher: async (req,res)=>{
  const routingKey="log"
  const exchangeType="direct"
  const exchangeName='my-directBackUp'
  const delay=0;
  console.log({
    exchangeName,
    exchangeType,
    routingKey
});
async function publisher() {
  const messages = []

  const sendMessage = async (connection, channel, message) => {
    
      const sent = channel.publish(
          exchangeName,
          routingKey,
          Buffer.from(JSON.stringify(message)),
          {
               persistent: true
          }
      )

      if (sent) {
          console.log(`Sent message to "${exchangeName}" exchange`, message)
          return
      }

      console.error({sent})
      throw new Error(`Fail sending message to "${exchangeName}" exchange, "${JSON.stringify(message)}"`)
  }
  

  const backOffMinTime1MaxTime4 = backOff(1)(4)
  const backOffMinTime1MaxTime32 = backOff(1)(32)
  const main = async (messages,wait)=> {
    try {
      const connection = await amqp.connect('amqp://localhost')
      const channel = await connection.createChannel()

      channel.assertExchange(exchangeName, exchangeType, {
          // durable: true
      })

      const sendMessageTimeout = () => {
          if (messages.length > 0) {
              setTimeout(sendMessageBackOff, delay, connection, channel, messages.shift())
              return
          }

          const message = {
              id: Math.random().toString(32).slice(2, 6),
              text: 'Hello world!'
          }

          setTimeout(sendMessageBackOff, delay, connection, channel, message)
      }

      const onErrorEnd = (_, ...args) => {
         // connection.close()
          const message = args[2]
          messages.push(message)

          mainBackOff(messages)
      }

      const sendMessageBackOff = backOffMinTime1MaxTime4(
          sendMessage,
          onErrorEnd,
          sendMessageTimeout,
          console.error
      )

      sendMessageTimeout()
  
    } catch (error) {
      let aux;
      if(wait){
        aux=wait;
        if(aux<=22){
         
          console.error('Error connecting to RabbitMQ server:', error.message);
          aux+=1;
          setTimeout(() => {
            mainBackOff(messages,aux*2)
          }, wait*1000);
        }else{
          console.log(error);
        }
      }else{
        mainBackOff(messages,1)
      } 
      
    }

  }

  const onErrorEnd = (error) => {
    console.log("OnErrorMain");
      console.error(error)
      mainBackOff(messages)
  }
  const mainBackOff = backOffMinTime1MaxTime32(
      main,
      onErrorEnd,
      console.log,
      console.error
  )

  mainBackOff(messages)
}

publisher().catch((error) => {
  console.error(error)
  process.exit(1)
})
res.render("RabbitMQ/BackOffPublisher");
},
BackOffSuscriber: async (req,res)=>{

  const pattern =  'log'
  const queue="suscriberBack";
  const exchangeType="direct"
  const exchangeName='my-directBackUp'
  const difficulty =9;
  console.log({
    exchangeName,
    exchangeType,
    pattern
});
function intensiveOperation() {
  const maxDifficulty = 10 ** difficulty
  const minDifficulty = Math.floor(maxDifficulty * .8)

  let i = minDifficulty + Math.floor(Math.random() * (maxDifficulty - minDifficulty))
  while (i--) {
  }
}

async function subscriber() {
  const backOffMinTime1MaxTime4 = backOff(1)(4)

  const main = async () => {
    try {
      const connection = await amqp.connect('amqp://localhost')
      const channel = await connection.createChannel()

      channel.prefetch(1)

       channel.on('close', () => {
           mainBackOff()
       })

      await channel.assertQueue(queue, {
          durable: true
      })

      await channel.assertExchange(exchangeName, exchangeType, {
          // durable: true
      })

      await channel.bindQueue(queue, exchangeName, pattern)

      channel.consume(queue, (message) => {
          const content = JSON.parse(message.content.toString())

          console.log(`Received message from "${queue}" queue`)
          console.log(content)

          intensiveOperation()

          console.log('DONE!')

          channel.ack(message)
      })
    } catch (error) {
      console.log(error)
      mainBackOff()
    }
       
  }

  const onErrorEnd = (error) => {
      console.error(error)
      mainBackOff().catch(console.error)
  }
  const mainBackOff = backOffMinTime1MaxTime4(
      main,
      onErrorEnd,
      console.log,
      console.error
  )

  mainBackOff()
}

subscriber().catch((error) => {
  console.error(error)
  process.exit(1)
})
res.render("RabbitMQ/BackOffSuscriber");
},
BackOffPublisherFuncional: async (req,res)=>{
  const routingKey="log"
  const exchangeType="direct"
  const exchangeName='my-directBackUp'
  const delay=2000;
  console.log({
    exchangeName,
    exchangeType,
    routingKey
});
async function publisher() {
  const messages = []
  const sendMessage = async (connection, channel, message) => {
    try {
      const sent = channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
             persistent: true
        }
    )
    console.log(`Sent message to "${exchangeName}" exchange`, message)
    } catch (error) {
      console.error(error)
      throw new Error(`Fail sending message to "${exchangeName}" exchange, "${JSON.stringify(message)}"`)
    }

  }
  

  const backOffMinTime1MaxTime4 = backOff(1)(4)
  const main = async (messages,wait)=> {
    try {
      const connection = await amqp.connect('amqp://localhost')
      const channel = await connection.createChannel()

      channel.assertExchange(exchangeName, exchangeType, {
          // durable: true
      })

      const sendMessageTimeout = () => {
          if (messages.length > 0) {
              setTimeout(sendMessageBackOff, delay, connection, channel, messages.shift())
              return
          }

          const message = {
              id: Math.random().toString(32).slice(2, 6),
              text: 'Hello world!'
          }

          setTimeout(sendMessageBackOff, delay, connection, channel, message)
      }

      const onErrorEnd = (_, ...args) => {
         // connection.close()
          const message = args[2]
          messages.push(message)

          main(messages)
      }

      const sendMessageBackOff = backOffMinTime1MaxTime4(
          sendMessage,
          onErrorEnd,
          sendMessageTimeout,
          console.error
      )

      sendMessageTimeout()
  
    } catch (error) {
      let aux;
      if(wait){
        aux=wait;
        if(aux<=22){
         
          console.error('Error connecting to RabbitMQ server:', error.message);
          aux+=1;
          setTimeout(() => {
            main(messages,aux*2)
          }, wait*1000);
        }else{
          console.log(error);
        }
      }else{
        main(messages,1)
      } 
      
    }

  }
  main(messages)
}

publisher().catch((error) => {
  console.error(error)
  process.exit(1)
})
res.render("RabbitMQ/BackOffPublisher");
},
BackOffSuscriberFuncional: async (req,res)=>{
  const pattern =  'log'
  const queue="suscriberBack";
  const exchangeType="direct"
  const exchangeName='my-directBackUp'
  console.log({
    exchangeName,
    exchangeType,
    pattern
});

async function subscriber() {
  const backOffMinTime1MaxTime4 = backOff(1)(4)
  const main = async (wait) => {
    try {
      const connection = await amqp.connect('amqp://localhost')
      const channel = await connection.createChannel()

      channel.prefetch(1)

       channel.on('close', () => {
           mainBackOff()
       })

      await channel.assertQueue(queue, {
          durable: true
      })

      await channel.assertExchange(exchangeName, exchangeType, {
          // durable: true
      })

      await channel.bindQueue(queue, exchangeName, pattern)

      channel.consume(queue, (message) => {
          const content = JSON.parse(message.content.toString())

          console.log(`Received message from "${queue}" queue`)
          console.log(content)
          console.log('DONE!')

          channel.ack(message)
      })
    } catch (error) {
      let aux;
      if(wait){
        aux=wait;
        if(aux<=22){
          console.error('Error connecting to RabbitMQ server:', error.message);
          aux+=1;
          setTimeout(() => {
            main(aux*2)
          }, wait*1000);
        }else{
          console.log(error);
        }
      }else{
        main(1);
      } 
    }
       
  }

  const onErrorEnd = (error) => {
      console.error(error)
      mainBackOff().catch(console.error)
  }
  const mainBackOff = backOffMinTime1MaxTime4(
      main,
      onErrorEnd,
      console.log,
      console.error
  )

  mainBackOff()
}

subscriber().catch((error) => {
  console.error(error)
  process.exit(1)
})
res.render("RabbitMQ/BackOffSuscriber");
},
};
//#region BackUP
const increaseBackOffTime = (currentBackoffTime) => currentBackoffTime * 2
const calculateBackOffDelayMs = (backoffTime) => 1000 * (backoffTime + Math.random())

const backOff = (minTime) => (maxTime) => (fn, onErrorEnd, onSuccess, onError) => {
    const _run = (currentTime) => (...args) => {
        setTimeout(async () => {
            try {
                const result = await fn(...args)

                if (onSuccess) {
                    onSuccess(result)
                }
            } catch (error) {
                if (currentTime >= maxTime) {
                    if (onErrorEnd) {
                        onErrorEnd(error, ...args)
                    }
                    return
                }

                if (onError) {
                    onError(error)
                }

                _run(increaseBackOffTime(currentTime))(...args)
            }
        }, calculateBackOffDelayMs(currentTime))
    }

    return _run(minTime)
}
//#endregion