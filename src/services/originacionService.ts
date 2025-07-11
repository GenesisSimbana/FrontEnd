import axios from 'axios';
import { MICROSERVICES } from '../constants';
import type { 
  SimulacionCreditoRequestDTO, 
  SimulacionCreditoResponseDTO 
} from '../types/automotive-loan';

class OriginacionService {
  private baseUrl = MICROSERVICES.ORIGINACION;

  private client = axios.create({
    baseURL: this.baseUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async simularCredito(data: SimulacionCreditoRequestDTO): Promise<SimulacionCreditoResponseDTO> {
    const response = await this.client.post<SimulacionCreditoResponseDTO>('/api/v1/solicitudes/simular', data);
    return response.data;
  }
}

export const originacionService = new OriginacionService();
export default originacionService; 