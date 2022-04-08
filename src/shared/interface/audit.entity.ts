import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

class Audit {
  @Exclude()
  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Column()
  @CreateDateColumn({ name: 'created_on' })
  createdOn: Date;

  @Column()
  @UpdateDateColumn({ name: 'last_modified_on' })
  lastModifiedOn: Date;
}

export default Audit;
