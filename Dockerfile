FROM node:16
# Crea el directorio de trabajo
WORKDIR /app

# Copia los Package necesarios
COPY package*.json ./

# Instala las dependencias
RUN npm install

#Copiando todos los Archivos 
COPY . .
# Expone el puerto
EXPOSE 3000

# Inicia la aplicación
CMD ["npm", "start"]