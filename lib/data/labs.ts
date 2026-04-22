import { Lab } from '@/types';

export const labs: Lab[] = [
  {
    id: 'penetration-testing',
    name: 'Penetration Testing Lab',
    description:
      'Hands-on environment with Kali Linux, Metasploit, and Nmap. Practice real-world ethical hacking techniques in a safe sandbox.',
    category: 'cybersecurity',
    difficulty: 'intermediate',
    hourlyPrice: 150,
    imageUrl:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    tags: ['Kali Linux', 'Metasploit', 'Nmap'],
    specs: { ram: '8GB', cpu: '4 vCPU', storage: '50GB SSD' },
  },
  {
    id: 'network-security',
    name: 'Network Security Lab',
    description:
      'Learn VLANs, packet analysis with Wireshark, and network topology design using Cisco Packet Tracer equivalents.',
    category: 'networking',
    difficulty: 'beginner',
    hourlyPrice: 100,
    imageUrl:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    tags: ['Cisco Packet Tracer', 'Wireshark', 'VLAN'],
    specs: { ram: '4GB', cpu: '2 vCPU', storage: '20GB SSD' },
  },
  {
    id: 'cloud-security',
    name: 'Cloud Security Lab',
    description:
      'Advanced cloud security scenarios on AWS and Azure with Infrastructure-as-Code using Terraform.',
    category: 'cloud',
    difficulty: 'advanced',
    hourlyPrice: 200,
    imageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    tags: ['AWS', 'Azure', 'Terraform'],
    specs: { ram: '16GB', cpu: '8 vCPU', storage: '100GB SSD' },
  },
  {
    id: 'devsecops',
    name: 'DevSecOps Pipeline',
    description:
      'End-to-end CI/CD pipeline with Jenkins, Docker, Kubernetes, and SonarQube for secure software delivery.',
    category: 'devops',
    difficulty: 'intermediate',
    hourlyPrice: 180,
    imageUrl:
      'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80',
    tags: ['Jenkins', 'Docker', 'Kubernetes', 'SonarQube'],
    specs: { ram: '8GB', cpu: '4 vCPU', storage: '60GB SSD' },
  },
];
