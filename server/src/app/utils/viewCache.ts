import NodeCache from "node-cache";

// Cache lasts 10 minutes (600 seconds)
const viewCache = new NodeCache({ stdTTL: 600 });

export default viewCache;
