import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

class Audit {
  @Exclude()
  @Column({ default: false })
  isDeleted: boolean;

  @Column()
  @CreateDateColumn()
  createdOn: Date;

  @Column()
  @UpdateDateColumn()
  lastModifiedOn: Date;
}

export default Audit;
