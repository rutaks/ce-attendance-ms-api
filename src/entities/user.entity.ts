import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', unique: false, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', unique: false, nullable: true })
  lastName: string;

  @Column({ unique: true, nullable: false })
  slug: string;
}
