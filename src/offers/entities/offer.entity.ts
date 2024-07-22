import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
